#include <WiFi.h>        //biblioteca responsável por conectar o ESP32 em uma rede wifi
#include <HTTPClient.h>  //bibliote responsável por fazer requisições http
#include <MFRC522.h>     //biblioteca responsável pela comunicação com o módulo RFID-RC522
#include <SPI.h>         //biblioteca para comunicação do barramento SPI
#include <Stepper.h>     //biblioteca responsável por girar o motor

const int stepsPerRevolution = 200;  // passos por volta
// (12 e 14 de um lado, 27 e 26 do outro)
Stepper myStepper(stepsPerRevolution, 12, 14, 27, 26);

#define SS_PIN 21
#define RST_PIN 22

#define SIZE_BUFFER 18
#define MAX_SIZE_BLOCK 16

//esse objeto 'chave' é utilizado para autenticação
MFRC522::MIFARE_Key key;
//código de status de retorno da autenticação
MFRC522::StatusCode status;

// Definicoes pino modulo RC522
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Instancia objeto http da classe HTTPClient
HTTPClient http;

const char* ssid = "campusrp-livre";  //ssid of your wifi
const char* password = "hfsu2@xu";    //password of your wifi

void setup() {
  // Inicia a serial
  Serial.begin(115200);
  SPI.begin();  // Init SPI bus

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);              //connecting to wifi
  while (WiFi.status() != WL_CONNECTED) {  // while wifi not connected
    delay(500);
    Serial.print(".");  //print "...."
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());  // Print the IP address

  // Inicia MFRC522
  mfrc522.PCD_Init();
}

void loop() {
  // Aguarda a aproximacao do cartao
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Seleciona um dos cartoes
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  int peso_retornado = getHTTP(leituraDados()); //recebe o peso vindo do sistema web
  ligaMotor(peso_retornado); //liga o motor de acordo com o peso retornado
}

//faz a leitura dos dados do cartão/tag
String leituraDados() {
  String valor;                                    // Variável que guardará o valor da tag
  for (byte i = 0; i < mfrc522.uid.size; i++) {    // Estrutura de repetição para ler cada byte da tag
    valor += String(mfrc522.uid.uidByte[i], HEX);  // Acumula cada byte da tag
  }

  // Encerra a leitura do cartão atual para evitar leituras repetidas
  mfrc522.PICC_HaltA();
  return valor;  // Retorna o valor lido da tag
}

int getHTTP(const String& valor) {
  String url = "http://192.168.2.234/pet/";
  url += valor;
  Serial.println(url);

  // Inicia a conexão com a URL
  http.begin(url);
  // Envia a requisição GET e guarda o código de status (ex: 200, 404)
  int httpCode = http.GET();
  if (httpCode > 0) {
    Serial.printf("Código HTTP: %d\n", httpCode);

    // Se a requisição deu certo (HTTP 200 OK)
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println("Conteúdo da página:");
      Serial.println(payload);
    }
  } else {
    Serial.printf("Falha na requisição. Erro: %s\n", http.errorToString(httpCode).c_str());
  }

  // Libera os recursos
  http.end();

  return 0;  // Colocar o valor do peso do retorno da página web
}

void ligaMotor(int peso_retornado) {
  int tempo100gr = 45; //tempo médio
  // ligar o motor de acordo com o tempo de acordo com o peso retornado
  int tempo = (tempo100gr*peso_retornado)/100;
  // ligar o motor de acordo com o tempo calculado
  // velocidade (200 RPM):
  myStepper.setSpeed(200);
  myStepper.step(stepsPerRevolution); //rotação por minuto
  delay(1000); //tempo de espera para iniciar a rotação
  myStepper.step(1); //rotação
  delay(tempo); //tempo do motor ligado de acordo com o peso da ração
}
