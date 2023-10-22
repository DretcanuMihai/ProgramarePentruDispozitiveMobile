import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons, IonCheckbox,
  IonContent, IonDatetime, IonFab, IonFabButton,
  IonHeader, IonIcon, IonImg,
  IonInput, IonItem, IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {getLogger, useMyLocation, usePhotos} from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import {camera} from "ionicons/icons";
import MyMap from "./MyMap";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [celebrationDate, setCelebrationDate] = useState<Date>(new Date());
  const [received, setReceived] = useState<boolean>(false);
  const [sentimentalValue, setSentimentalValue] = useState<number>(0);
  const [text, setText] = useState('');
  const [item, setItem] = useState<ItemProps>();

  const [photo, setPhoto] = useState<string|undefined>('');

  const [latitude, setLatitude] = useState<number|undefined>(0);
  const [longitude, setLongitude] = useState<number|undefined>(0);

  const myLocation = useMyLocation();
  const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setCelebrationDate(item.celebrationDate);
      setReceived(item.received)
      setSentimentalValue(item.sentimentalValue);
      setText(item.text);
      setPhoto(item.photo);
      setLatitude(item.latitude||lat);
      setLongitude(item.longitude||lng);
    }else{
      setLatitude(lat);
      setLongitude(lng);
    }
  }, [match.params.id, items,lat,lng]);
  const handleSave = () => {
    const editedItem = item ? { ...item, celebrationDate, received, sentimentalValue, text, photo, latitude, longitude } : { celebrationDate, received, sentimentalValue, text, photo, latitude, longitude };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };


  const {photos, takePhoto, deletePhoto,}=usePhotos();
  const [photoTaken, setPhotoTaken]=useState(false);

  useEffect(() => {
    log('useEffect');
    photoTaken && photos && photos[0] && photos[0].webviewPath && setPhoto(photos[0].webviewPath)
  }, [photos,photoTaken]);

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          {photo &&
              <IonImg src={photo}
                      onClick={() => setPhoto('')}/>}
        </IonItem>
        {latitude && longitude &&
            <IonItem>
              <MyMap
                  lat={latitude}
                  lng={longitude}
                  onMapClick={(position)=>{
                    setLatitude(position.latitude);
                    setLongitude(position.longitude);
                  }}
                  onMarkerClick={()=>log('onMarker')}
              />
            </IonItem>
        }
        <IonItem>
          <IonLabel>Celebration Date:</IonLabel>
          <IonDatetime
              value={celebrationDate.toString()}
              onIonChange={e => setCelebrationDate(e.detail.value ? new Date(e.detail.value) : new Date())}
              displayFormat="YYYY-MM-DD"
          />
        </IonItem>
        <IonItem>
          <IonLabel>Received:</IonLabel>
          <IonCheckbox
              checked={received}
              onIonChange={e => setReceived(e.detail.checked || false)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Sentimental Value:</IonLabel>
          <IonInput
              value={sentimentalValue}
              type="number"
              onIonChange={e => setSentimentalValue(Number(e.detail.value) || 0)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Text:</IonLabel>
        </IonItem>
        <IonInput value={text} onIonChange={e => setText(e.detail.value || '')} />
        <IonLoading isOpen={saving} />
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={async () => {
            try {
              await takePhoto();
              setPhotoTaken(true);
            }
            catch (e){

            }
          }}>
            <IonIcon icon={camera}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
