#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import argparse

parser = argparse.ArgumentParser(description="Writes data to an RC522 RFID tag.")
parser.add_argument('-d', '--data', type=str, required=True, help='The data (text) to be written to the RFID tag. Must be a string.')
args = parser.parse_args()

reader = SimpleMFRC522()

try:
	data = args.data
	#print('Now place your tag to write...')
	reader.write(data)
	print('Successfully wrote data to the card!')

except Exception as e:
	print(f"An error occurred during the write process: {e}")

finally:
	GPIO.cleanup()
