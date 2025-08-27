#include <WiFi.h>
#include <WebSocketsServer.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <SD.h>
#include <SPI.h>

const char* ssid = "ESP32-GPS";
const char* password = "12345678";

HardwareSerial gpsSerial(1);
TinyGPSPlus gps;

WebSocketsServer webSocket = WebSocketsServer(81);
unsigned long lastSend = 0;

#define SD_CS 5
File logFile;
String currentFilename = "";  // Nom du fichier en cours

double lastLat = 0.0, lastLon = 0.0;
double totalDistance = 0.0;

// --- Variables pour nouvelles fonctionnalités ---
double maxSpeed = 0.0;
int sprintCount = 0;
bool sprintActive = false;

double sprintThreshold = 14.0; // km/h pour football
double runThreshold = 7.0;     // km/h
double walkThreshold = 0.5;    // km/h

unsigned long sprintDuration = 0;
unsigned long runDuration = 0;
unsigned long walkDuration = 0;
unsigned long gameStartTime = 0;
unsigned long lastMillis = 0;

// --- Distances par type de mouvement ---
double sprintDistance = 0.0;
double runDistance = 0.0;
double walkDistance = 0.0;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, 17, 16);

  WiFi.softAP(ssid, password);
  Serial.println("🔗 Point d'accès Wi-Fi lancé");
  Serial.print("IP : "); Serial.println(WiFi.softAPIP());

  webSocket.begin();
  webSocket.onEvent([](uint8_t, WStype_t, uint8_t *, uint16_t) {});

  if (!SD.begin(SD_CS)) {
    Serial.println("❌ Carte SD non initialisée !");
  } else {
    Serial.println("✅ Carte SD initialisée.");
  }

  gameStartTime = millis();
  lastMillis = millis();
}

// --- Fonction pour gérer le fichier du jour ---
void updateLogFile() {
  if (gps.date.isValid()) {
    char filename[20];
    sprintf(filename, "/%04d-%02d-%02d.txt",
            gps.date.year(),
            gps.date.month(),
            gps.date.day());

    if (currentFilename != String(filename)) {
      currentFilename = String(filename);

      logFile = SD.open(currentFilename, FILE_APPEND);
      if (logFile) {
        Serial.print("📁 Nouveau fichier ouvert : ");
        Serial.println(currentFilename);

        // En-tête CSV si fichier neuf
        if (logFile.size() == 0) {
          logFile.println("lat,lon,alt,speed_kmph,speed_mps,sats,hdop,deltaDistance,totalDistance,maxSpeed,sprintCount,sprintDuration,runDuration,walkDuration,gameTime,sprintDistance,runDistance,walkDistance,time,date");
          logFile.flush();
        }
      } else {
        Serial.println("❌ Erreur ouverture fichier !");
      }
    }
  }
}

void loop() {
  while (gpsSerial.available()) gps.encode(gpsSerial.read());
  webSocket.loop();

  if (millis() - lastSend > 500) { // 2 Hz
    lastSend = millis();

    if (gps.location.isUpdated()) {
      if (!gps.hdop.isValid() || !gps.satellites.isValid()) return;

      // --- Gérer fichier du jour ---
      updateLogFile();

      double currentLat = gps.location.lat();
      double currentLon = gps.location.lng();
      double hdopVal = gps.hdop.hdop();
      uint32_t sats = gps.satellites.value();
      double spdMps = gps.speed.mps();
      double speedKmph = gps.speed.kmph();
      double deltaDistance = 0.0;

      // Calcul distance
      if (lastLat != 0.0 && lastLon != 0.0) {
        double dist = TinyGPSPlus::distanceBetween(lastLat, lastLon, currentLat, currentLon);
        if (sats >= 5 && hdopVal <= 3.0 && dist > 0.6 && dist <= 10.0) {
          totalDistance += dist;
          deltaDistance = dist;

          // Ajout aux bonnes catégories
          if (speedKmph >= sprintThreshold) {
            sprintDistance += dist;
          } else if (speedKmph >= runThreshold && speedKmph < sprintThreshold) {
            runDistance += dist;
          } else if (speedKmph >= walkThreshold && speedKmph < runThreshold) {
            walkDistance += dist;
          }
        }
      }

      lastLat = currentLat;
      lastLon = currentLon;

      // --- Vitesse max ---
      if (speedKmph > maxSpeed) maxSpeed = speedKmph;

      // --- Type de mouvement et durées ---
      unsigned long currentMillis = millis();
      unsigned long dt = currentMillis - lastMillis;
      lastMillis = currentMillis;

      // Sprint
      if (speedKmph >= sprintThreshold) {
        if (!sprintActive) {
          sprintActive = true;
          sprintCount++;
        }
        sprintDuration += dt;
      } else {
        sprintActive = false;
      }

      // Course
      if (speedKmph >= runThreshold && speedKmph < sprintThreshold) {
        runDuration += dt;
      }

      // Marche
      if (speedKmph >= walkThreshold && speedKmph < runThreshold) {
        walkDuration += dt;
      }

      // Temps de jeu total
      unsigned long gameTime = currentMillis - gameStartTime;

      // --- Conversion des durées en minutes et secondes ---
      unsigned long sprintMin = (sprintDuration / 1000) / 60;
      unsigned long sprintSec = (sprintDuration / 1000) % 60;

      unsigned long runMin = (runDuration / 1000) / 60;
      unsigned long runSec = (runDuration / 1000) % 60;

      unsigned long walkMin = (walkDuration / 1000) / 60;
      unsigned long walkSec = (walkDuration / 1000) % 60;

      unsigned long gameMin = (gameTime / 1000) / 60;
      unsigned long gameSec = (gameTime / 1000) % 60;

      // --- JSON ---
      String json = "{";
      json += "\"lat\":" + String(currentLat, 6) + ",";
      json += "\"lon\":" + String(currentLon, 6) + ",";
      json += "\"alt\":" + String(gps.altitude.meters()) + ",";
      json += "\"speedKmph\":" + String(speedKmph, 2) + ",";
      json += "\"speedMps\":" + String(spdMps, 2) + ",";
      json += "\"sats\":" + String(sats) + ",";
      json += "\"hdop\":" + String(hdopVal, 2) + ",";
      json += "\"deltaDistance\":" + String(deltaDistance, 2) + ",";
      json += "\"totalDistance\":" + String(totalDistance, 2) + ",";
      json += "\"maxSpeed\":" + String(maxSpeed, 2) + ",";
      json += "\"sprintCount\":" + String(sprintCount) + ",";
      json += "\"sprintDuration\":\"" + String(sprintMin) + "m " + String(sprintSec) + "s\",";
      json += "\"runDuration\":\"" + String(runMin) + "m " + String(runSec) + "s\",";
      json += "\"walkDuration\":\"" + String(walkMin) + "m " + String(walkSec) + "s\",";
      json += "\"gameTime\":\"" + String(gameMin) + "m " + String(gameSec) + "s\",";
      json += "\"sprintDistance\":" + String(sprintDistance, 2) + ",";
      json += "\"runDistance\":" + String(runDistance, 2) + ",";
      json += "\"walkDistance\":" + String(walkDistance, 2) + ",";
      json += "\"time\":\"" + String(gps.time.hour()) + ":" + String(gps.time.minute()) + ":" + String(gps.time.second()) + "\",";
      json += "\"date\":\"" + String(gps.date.day()) + "/" + String(gps.date.month()) + "/" + String(gps.date.year()) + "\"";
      json += "}";

      Serial.println(json);
      webSocket.broadcastTXT(json);

      // --- Écriture SD ---
      if (logFile) {
        logFile.print(String(currentLat, 6) + ",");
        logFile.print(String(currentLon, 6) + ",");
        logFile.print(String(gps.altitude.meters()) + ",");
        logFile.print(String(speedKmph, 2) + ",");
        logFile.print(String(spdMps, 2) + ",");
        logFile.print(String(sats) + ",");
        logFile.print(String(hdopVal, 2) + ",");
        logFile.print(String(deltaDistance, 2) + ",");
        logFile.print(String(totalDistance, 2) + ",");
        logFile.print(String(maxSpeed, 2) + ",");
        logFile.print(String(sprintCount) + ",");
        logFile.print(String(sprintMin) + "m " + String(sprintSec) + "s,");
        logFile.print(String(runMin) + "m " + String(runSec) + "s,");
        logFile.print(String(walkMin) + "m " + String(walkSec) + "s,");
        logFile.print(String(gameMin) + "m " + String(gameSec) + "s,");
        logFile.print(String(sprintDistance, 2) + ",");
        logFile.print(String(runDistance, 2) + ",");
        logFile.print(String(walkDistance, 2) + ",");
        logFile.print(String(gps.time.hour()) + ":" + String(gps.time.minute()) + ":" + String(gps.time.second()) + ",");
        logFile.println(String(gps.date.day()) + "/" + String(gps.date.month()) + "/" + String(gps.date.year()));
        logFile.flush();
      }
    }
  }
}
