// Arduino IDE code for ESP8266
// Luís Cunha (Nov_2022)
// Todo: check timers of esp8266:
// https://github.com/esp8266/Arduino/tree/b7c7bc038d2f4acc062bf209162e963f14464b9c/cores/esp8266
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#define pwm_pin 15 // gpio15 / D8

// UDP vars
WiFiUDP Udp;
unsigned int localUdpPort = 4210;
char incomingPacket[256];

// softAP vars
IPAddress local_IP(192,168,4,22);
IPAddress gateway(192,168,4,9);
IPAddress subnet(255,255,255,0);
// current values
int frequency = 140;
int duty = 20; 
int in_duty=0;
int in_freq=0;
void setup() {
      in_duty=duty; in_freq=frequency;
  analogWriteRange(255);
  Serial.begin(115200);
  Serial.print("Setting soft-AP ... ");
  // Setup SoftAP
  WiFi.softAPConfig (local_IP, gateway, subnet);

  boolean result = WiFi.softAP("ControladorCC", "1234567890");
  if(result == true)   {
    Serial.println("Ready");  }
  else {
    Serial.println("Failed!"); }
  pinMode(pwm_pin, OUTPUT);
  // Setup UDP
  Udp.begin(localUdpPort); }
    char duty_str[10];
    char freq_str[10];
    int i,t,len;
void loop() {

  //Serial.printf("Stations connected = %d\n", WiFi.softAPgetStationNum());
  delay(250); 
  int packetSize = Udp.parsePacket();
  if (packetSize) {
      Serial.printf("Received %d bytes from %s, port %d\n", packetSize, Udp.remoteIP().toString().c_str(), Udp.remotePort());
      len = Udp.read(incomingPacket, 255);
      if (len > 0) { incomingPacket[len] = 0; }
      Serial.printf("UDP packet contents: %s\n", incomingPacket);
  
      for (i=0; incomingPacket[i] != '|'; i++)
        duty_str[i] = incomingPacket[i];
      duty_str[i] = '\n';
      i++; t=0;
      for (; incomingPacket[i] != '\0'; i++) {
        freq_str[t++] = incomingPacket[i]; }
      freq_str[t] = '\n';
      in_duty=0; in_freq=0;
      for(i=0; duty_str[i]!='\n'; i++) in_duty = in_duty * 10 + ( duty_str[i] - '0' );
      for(i=0; freq_str[i]!='\n'; i++) in_freq = in_freq * 10 + ( freq_str[i] - '0' );
      duty = in_duty ;
      if(frequency<10) frequency = 10;
      frequency = in_freq;
      
      analogWriteFreq(frequency);
      analogWrite(pwm_pin, duty);
      Serial.printf("freq: %d  duty: %d\n",  frequency, duty);
      Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
      char f[10] = "cotch!\n\0";
      Udp.write(f);
      Udp.endPacket();  } }
