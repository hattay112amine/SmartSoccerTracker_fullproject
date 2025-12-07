# ⚽ Smart Soccer Tracker – README Officiel 🚀

Le **Smart Soccer Tracker** est un projet conçu dans le cadre du *Stage d'Été II2A*.  
Il vise à offrir une solution **fiable, accessible et adaptée au contexte sportif tunisien** pour analyser les performances des joueurs en temps réel.

---

## 📝 1. Overview

Le projet consiste à développer un système complet permettant de :

- Collecter des données GPS (distance, vitesse, sprints…)
- Les enregistrer sur une carte SD
- Les visualiser via une application mobile dédiée

<div align="center">
  <img src="https://github.com/user-attachments/assets/731c238a-bdb0-47d9-97f5-d09eb345cc4b" width="350" />
</div>

---

## 🎯 2. Objectives

### ✔️ Hardware  
Concevoir un système embarqué autonome et économique composé de :  
- ESP32  
- GPS NEO-7M  
- Batterie 2×18650  
- Module SD Card

### ✔️ Firmware  
Développer un logiciel embarqué pour :  
- Lire les données GPS  
- Calculer : distance, vitesse, temps, sprints  
- Enregistrer les données au format `.txt` sur SD

### ✔️ Mobile App (React Native)  
Créer une application permettant :  
- Importation depuis la carte SD  
- Visualisation statistique  
- Comparaisons et analyses par les coachs

### ✔️ Validation  
Proposer une solution **low-cost** utilisable par les clubs tunisiens.

---

## ⚙️ 3. System Architecture

---

## 🔧 3.1 Embedded Tracker

### **ESP32**
<div align="center">
  <img src="https://github.com/user-attachments/assets/5d6f8142-82bb-4672-b06e-8183f3c6940c" width="220" />
</div>

### **GPS Module – NEO-7M**
<div align="center">
  <img src="https://github.com/user-attachments/assets/7e785fc7-a48f-436d-94e7-50b70f44a41b" width="220" />
</div>

### **SD Card Module**
<div align="center">
  <img src="https://github.com/user-attachments/assets/0fd5650c-4cbb-4801-a026-ff6c0bde72c8" width="220" />
</div>

### **Battery Shield 2×18650**
<div align="center">
  <img src="https://github.com/user-attachments/assets/db589132-f849-4c7d-9aec-91e4dbbae6b0" width="220" />
</div>

#### 🔋 Autonomy Requirement
- Fonctionner **3 heures** sans recharge  
- Système entièrement autonome

---

## 📱 3.2 Mobile Application (React Native)

### **Authentication**
<div align="center">
  <img src="https://github.com/user-attachments/assets/ecb6bbd9-0967-4ab0-88ac-45b05a3718f3" width="260" />
  <img src="https://github.com/user-attachments/assets/d0a545d7-b3f8-4313-8341-49986cf7f7b1" width="260" />
</div>

### **Home / Dashboard**
<div align="center">
  <img src="https://github.com/user-attachments/assets/bf2d8316-0037-4936-ab3a-4acdd1d184a9" width="280" />
</div>

### **Importation des Données**
<div align="center">
  <img src="https://github.com/user-attachments/assets/83e24d93-a448-4b0c-91fd-00d816e42e24" width="260" />
  <img src="https://github.com/user-attachments/assets/e4089f70-66f5-464c-9d60-5aa3e1800712" width="260" />
</div>

### **Maps & Player Stats**
<div align="center">
  <img src="https://github.com/user-attachments/assets/94b574d4-48f1-4ce6-89d1-e142bca48d15" width="260" />
  <img src="https://github.com/user-attachments/assets/480bcf06-b9c6-4697-bd5b-71c46a0fe79d" width="260" />
</div>

### **Graphs**
<div align="center">
  <img src="https://github.com/user-attachments/assets/e77bacec-c18b-43a9-bfe0-df23075320b6" width="260" />
  <img src="https://github.com/user-attachments/assets/0f0d3e3e-e018-43d3-a215-a9686337d259" width="260" />
</div>

---

## ☁️ 4. Backend / Cloud Services

Le projet prévoit l’utilisation de **Appwrite** pour :  
- Authentification  
- Gestion d'utilisateurs  
- Stockage  
- Synchronisation cloud  

<div align="center">
  <img src="https://github.com/user-attachments/assets/d26fed56-05b6-4913-8dda-672956493b48" width="400" />
</div>

---

## 📌 5. Conclusion

Le Smart Soccer Tracker constitue une solution complète, portable, autonome et accessible pour la performance sportive.  
Il combine **IoT + GPS + mobile + data analysis**, tout en restant **low-cost** pour permettre aux clubs tunisiens de moderniser leur suivi des joueurs.
