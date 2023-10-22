import React, { useState } from 'react';
import {createAnimation, IonModal, IonButton, IonContent, IonItem} from '@ionic/react';
import {useNetwork} from "../core";

export const MyModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { networkStatus } = useNetwork();


    const enterAnimation = (baseEl: any) => {
        console.log(baseEl);
    const root = baseEl;
    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  const leaveAnimation = (baseEl: any) => {
    return enterAnimation(baseEl).direction('reverse');
  }

  console.log('MyModal', showModal);
  return (
    <>
      <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
          <p>Network status is {networkStatus.connected? "Connected":"Not Connected"}</p>
          <br/>
          <p>Connection type is {networkStatus.connectionType}</p>
        <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>Show Network Status</IonButton>
    </>
  );
};
