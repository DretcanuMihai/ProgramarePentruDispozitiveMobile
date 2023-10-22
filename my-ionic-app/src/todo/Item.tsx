import React from 'react';
import {IonImg, IonItem, IonLabel} from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, photo, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(_id)}>
        {photo &&
            <IonImg src={photo}/>}
      <IonLabel>{text}</IonLabel>
    </IonItem>
  );
};

export default Item;
