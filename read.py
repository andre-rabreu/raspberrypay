#!/usr/bin/env python

import RPi.GPIO as GPIO
import json
from mfrc522 import SimpleMFRC522
from time import sleep

reader = SimpleMFRC522()

try:
	#print('Place your tag to read...')
	id, data = reader.read()
	output = json.dumps({ "id": id, "data": data.strip() })
	print(output)
finally:
	GPIO.cleanup()
