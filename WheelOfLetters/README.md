# Harfler Çarkı - Android Oyunu

Bu proje, orijinal web tabanlı "Wheel of Letters" oyununun React Native ile geliştirilmiş Android versiyonudur.

## Özellikler

- 🎮 İki oyunculu kelime oyunu
- ⏰ 10 saniyelik zamanlayıcı
- 🎯 26 farklı kategori
- 📱 Mobil-optimized arayüz
- 🏆 Puan sistemi ve kazanan belirleme
- 🎨 Modern ve kullanıcı dostu tasarım

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- Expo CLI
- Android Studio (Android geliştirme için)
- Xcode (iOS geliştirme için - sadece macOS)

### Adımlar

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd WheelOfLetters
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

4. Expo Go uygulamasını telefonunuza indirin ve QR kodu tarayın, ya da:
   - Android için: `npm run android`
   - iOS için: `npm run ios`

## Oyun Kuralları

1. Her oyuncu, verilen kategoriyle ilgili cevabının baş harfini harf çemberinde işaretleyerek puan kazanır
2. Her cevap, harf çemberindeki farklı bir harfle başlamalıdır
3. Soruları cevaplamak için 10 saniye süre vardır
4. Süre dolursa oyuncu -1 puan alır
5. Her oyuncunun 2 pas hakkı vardır
6. 2. pas kullanılması veya tüm harfler bitince oyun sona erer

## Kategoriler

Oyunda 26 farklı kategori bulunmaktadır:
- Kız/Erkek İsimleri
- Meyveler, Sebzeler
- Hayvanlar, Şehirler, Ülkeler
- Markalar, Kulüpler
- Eğlence (Film, Dizi, Müzik)
- Ve daha fazlası...

## Geliştirme

### Proje Yapısı
```
WheelOfLetters/
├── App.js              # Ana uygulama bileşeni
├── app.json           # Expo konfigürasyonu
├── package.json       # Proje bağımlılıkları
└── assets/           # Görsel varlıklar
```

### APK Oluşturma

1. EAS CLI'yi yükleyin:
```bash
npm install -g @expo/eas-cli
```

2. EAS hesabınıza giriş yapın:
```bash
eas login
```

3. Android APK oluşturun:
```bash
npm run build:android
```

## Teknolojiler

- **React Native**: Cross-platform mobil uygulama geliştirme
- **Expo**: Hızlı geliştirme ve dağıtım platformu
- **React Hooks**: Modern React state yönetimi
- **Vector Icons**: Güzel ikonlar için

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Orijinal oyun kredileri korunmalıdır.

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## İletişim

Sorularınız için: incerta@protonmail.com