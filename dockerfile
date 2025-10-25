# =========================
#  Dockerfile - React Native CLI (Android)
# =========================

# Étape 1 : utiliser une image Node avec Java (nécessaire pour Gradle)
FROM node:18-bullseye

# Installer dépendances système nécessaires à Android SDK & React Native
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    gradle \
    && rm -rf /var/lib/apt/lists/*

# Définir variables d’environnement Android
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# Installer Android SDK + outils nécessaires
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    cd $ANDROID_HOME/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip && \
    unzip cmdline-tools.zip && \
    rm cmdline-tools.zip && \
    mv cmdline-tools latest && \
    yes | sdkmanager --licenses || true && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers du projet
COPY package*.json ./
RUN npm install

COPY . .

# Exposer le port du serveur Metro
EXPOSE 8081

# Lancer Metro (le serveur JS pour React Native)
CMD ["npx", "react-native", "start"]
