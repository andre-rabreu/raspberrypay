import RPi.GPIO as GPIO

GPIO.setwarnings(False)

try:
	GPIO.cleanup()
	print('Cleanup successful!')
except Exception as e:
	print(f'There was an error: {e}')
