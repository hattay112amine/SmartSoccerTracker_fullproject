⚽ README: Smart Soccer Tracker Project 🚀
This README provides a summary and essential details about the Smart Soccer Tracker project, as documented in the provided summer internship report (Rapport de Stage d'Été II2A).

📝 Project Overview
The Smart Soccer Tracker project aims to design and develop a reliable, affordable, and accessible sports performance tracking system specifically adapted to the Tunisian sporting context.
<img width="312" height="825" alt="structure_projet" src="https://github.com/user-attachments/assets/731c238a-bdb0-47d9-97f5-d09eb345cc4b" />
The core goal is to enable football clubs and coaches, particularly those with limited resources, to collect and analyze key performance metrics of players in real-time.

🎯 Key Objectives
The main objectives of the project are:
-Hardware Design: Conceive an autonomous and economical embedded system integrating an ESP32 microcontroller, a NEO-7M GPS module, and a battery-powered supply for real-time athletic performance monitoring.
-Firmware Development: Develop a dedicated firmware to acquire, process, and record performance metrics (distance, speed, playing time, sprints) onto an SD memory card.
-Mobile Application: Create an intuitive mobile application (using React Native) to import and visualize detailed player statistics from the recorded data.
-Validation: Validate an accessible solution that offers Tunisian coaches and clubs a powerful, low-cost analysis tool.

⚙️ System Components and Technologies
The system is composed of two main parts:

1. Embedded System (Tracker)

-Microcontroller: ESP32 
![esp32](https://github.com/user-attachments/assets/5d6f8142-82bb-4672-b06e-8183f3c6940c)
-GPS Module: NEO-7M 
![gpsneo7m](https://github.com/user-attachments/assets/7e785fc7-a48f-436d-94e7-50b70f44a41b)
Functionality: Acquires and processes real-time metrics (speed, distance, time, sprints) and saves them to an SD card.
![module-carte-memoire-pour-arduino](https://github.com/user-attachments/assets/0fd5650c-4cbb-4801-a026-ff6c0bde72c8)
![module-2x18650-battery-shield-3v5v-pour-arduino-esp32-esp8266](https://github.com/user-attachments/assets/db589132-f849-4c7d-9aec-91e4dbbae6b0)
Non-functional Requirements: Must operate for a full 3-hour session without recharging (Autonomy).

2. Mobile Application
Technology: React Native
![signinscreen](https://github.com/user-attachments/assets/ecb6bbd9-0967-4ab0-88ac-45b05a3718f3)
![signupscreen](https://github.com/user-attachments/assets/d0a545d7-b3f8-4313-8341-49986cf7f7b1)
![pageacceuil](https://github.com/user-attachments/assets/bf2d8316-0037-4936-ab3a-4acdd1d184a9)
![importation1](https://github.com/user-attachments/assets/83e24d93-a448-4b0c-91fd-00d816e42e24)
![importation2](https://github.com/user-attachments/assets/e4089f70-66f5-464c-9d60-5aa3e1800712)
![cartes](https://github.com/user-attachments/assets/94b574d4-48f1-4ce6-89d1-e142bca48d15)
![détails](https://github.com/user-attachments/assets/480bcf06-b9c6-4697-bd5b-71c46a0fe79d)
![gaphe2](https://github.com/user-attachments/assets/e77bacec-c18b-43a9-bfe0-df23075320b6)
![graphe1](https://github.com/user-attachments/assets/0f0d3e3f-e018-43d3-a215-a9686337d259)
Functionality: Imports data from the SD card, allows players to view their statistics, and coaches to view and compare team performance.

Backend/Services: Integration of Appwrite services is part of the implementation plan.
<img width="2048" height="1639" alt="image" src="https://github.com/user-attachments/assets/d26fed56-05b6-4913-8dda-672956493b48" />


