from celery import shared_task
from time import sleep


@shared_task(bind=True)
def go_to_sleep(self):
    i = 0
    while(i < 10):
        print(i)
        sleep(5)

        i += 1

    return ('Done')


@shared_task(bind=True)
def voice(self):
    sleep(10)
    import speech_recognition as sr
    # wrong = request.session.get('wrong')
    # flag2 = request.session.get('flag2')
    word1 = 'blue'
    judge = 'OK'
    context = {}
    if(1 == 1):
        # get audio from the microphone
        r = sr.Recognizer()
        with sr.Microphone() as source:
            audio = r.listen(source)
            print("Speak:")

        try:
            text1 = r.recognize_google(audio)
            if word1 in text1:
                judge = "Hmm, I see"
            else:
                judge = "Yeah, not sure about that"
                # wrong = wrong+1
            output = " " + text1
        except sr.UnknownValueError:
            output = "Please press record when you are ready to speak"
        except sr.RequestError as e:
            output = "Could not request results; {0}".format(e)

    context['data'] = output
    context['judge'] = judge
    # request.session['wrong'] = wrong
    # request.session['flag2'] = flag2
    # context['flag'] = flag2
    print(output)


@shared_task(bind=True)
def facial(self):
    from keras.models import load_model
    from time import sleep
    from keras.preprocessing.image import img_to_array
    from keras.preprocessing import image
    import cv2
    import numpy as np
    face_classifier = cv2.CascadeClassifier(
        'main/static/main/haarcascade_frontalface_default.xml')
    classifier = load_model('main/static/main/Emotion_Detection.h5')

    class_labels = ['Angry', 'Happy', 'Neutral', 'Sad', 'Surprise']

    cap = cv2.VideoCapture(0)

    while True:
        # Grab a single frame of video
        ret, frame = cap.read()
        labels = []
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48),
                                  interpolation=cv2.INTER_AREA)

            if np.sum([roi_gray]) != 0:
                roi = roi_gray.astype('float')/255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi, axis=0)

            # make a prediction on the ROI, then lookup the class

                preds = classifier.predict(roi)[0]
                # print("\nprediction = ", preds)
                label = class_labels[preds.argmax()]
                # print("\nprediction max = ", preds.argmax())
                # print("\nlabel = ", label)
                label_position = (x, y)
                cv2.putText(frame, label, label_position,
                            cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
            else:
                cv2.putText(frame, 'No Face Found', (20, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 3)
            # print("\n\n")
        # cv2.imshow('Emotion Detector', frame)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    # cap.release()
    # cv2.destroyAllWindows()
