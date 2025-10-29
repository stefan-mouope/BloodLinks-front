# Configuration Firebase pour l'enregistrement des appareils

## ✅ Ce qui a été fait

### 1. Hook `useNotification` amélioré
Le hook dans `src/firabase/useNotification.ts` a été corrigé pour :
- ✅ Vérifier si l'utilisateur est connecté avant d'initialiser les notifications
- ✅ Ajouter des logs détaillés pour le débogage
- ✅ Gérer correctement les permissions Android et iOS
- ✅ Enregistrer le token FCM sur le serveur avec l'ID de l'utilisateur

### 2. Intégration dans AppNavigation
Le hook a été intégré dans `src/Navigation/AppNavigation.tsx` :
- ✅ Le hook s'exécute automatiquement quand un utilisateur est connecté
- ✅ L'ID de l'utilisateur (`user?.id`) est passé au hook
- ✅ Le token est enregistré au moment de la connexion

### 3. Flux d'enregistrement

**Au démarrage de l'application** :
1. Les permissions de notification sont demandées automatiquement
2. Le service de notifications est initialisé

**Quand un utilisateur se connecte** :
1. Le hook détecte le changement d'ID utilisateur
2. Le token FCM est récupéré (une seule fois au démarrage)
3. Le token est envoyé au serveur via l'endpoint `/notifications/fcm-tokens/`
4. Le token est stocké localement dans AsyncStorage pour éviter les doublons
5. Les permissions ne sont demandées qu'une seule fois grâce à `useRef`

## 📋 Ce qui reste à faire

### 1. Installer les dépendances Firebase

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### 2. Configuration Android

#### A. Ajouter google-services.json
1. Téléchargez le fichier `google-services.json` depuis la console Firebase
2. Placez-le dans `android/app/`

#### B. Modifier android/build.gradle
Ajoutez cette ligne dans la section `dependencies` :

```gradle
dependencies {
    classpath("com.google.gms:google-services:4.4.0")
    // ... autres dépendances
}
```

#### C. Modifier android/app/build.gradle
Ajoutez à la fin du fichier :

```gradle
apply plugin: "com.google.gms.google-services"
```

#### D. Modifier android/app/src/main/AndroidManifest.xml
Ajoutez les permissions nécessaires :

```xml
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <application ...>
        <!-- ... autres configurations -->
    </application>
</manifest>
```

### 3. Configuration iOS

#### A. Ajouter GoogleService-Info.plist
1. Téléchargez le fichier depuis la console Firebase
2. Placez-le dans `ios/`

#### B. Installer les pods
```bash
cd ios
pod install
cd ..
```

### 4. Vérifier l'API backend
Assurez-vous que l'endpoint suivant est disponible sur votre backend :

```
POST /notifications/fcm-tokens/
Body:
{
  "user": <user_id>,
  "token": "<fcm_token>",
  "device_name": "android" | "ios"
}
```

## 🔍 Comment tester

1. **Installer les dépendances** :
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/messaging
   ```

2. **Configurer Firebase** pour Android et iOS (voir ci-dessus)

3. **Lancer l'application** :
   ```bash
   npm run android
   # ou
   npm run ios
   ```

4. **Se connecter** avec un utilisateur

5. **Vérifier les logs** dans la console :
   - `✅ Permission notifications accordée`
   - `📱 Token FCM récupéré`
   - `✅ Token enregistré pour l'utilisateur: <id>`

6. **Vérifier dans votre backend** que le token a été enregistré

## 🐛 Dépannage

### Le token n'est pas envoyé au serveur
- Vérifiez que Firebase est bien configuré (google-services.json pour Android)
- Vérifiez les logs de la console pour les erreurs
- Vérifiez que le backend est accessible via l'API configurée

### Permission refusée
- Sur Android, allez dans Paramètres > Apps > BloodLink > Notifications
- Activez les notifications manuellement

### L'app plante au démarrage
- Vérifiez que toutes les dépendances sont installées
- Vérifiez que google-services.json est bien présent
- Lancez `cd android && ./gradlew clean`

## 📝 Structure du code

```
src/
├── firabase/
│   └── useNotification.ts         # Hook d'initialisation
├── services/
│   ├── NotificationService.ts     # Service de gestion des notifications
│   └── interfaces/
│       └── INotificationService.ts
└── store/
    └── NotificationStorage.ts     # Stockage local du token
```

