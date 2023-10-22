import React, {useContext, useEffect, useState} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  createAnimation,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel,
  IonList, IonLoading,
  IonPage, IonSearchbar, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {add, logOut} from 'ionicons/icons';
import Item from './Item';
import {getLogger, useNetwork} from '../core';
import { ItemContext } from './ItemProvider';
import {AuthContext} from "../auth";
import "./ItemList.css"
import {MyModal} from "./MyModal";

const log = getLogger('ItemList');

let MAX_PER_PAGE=5;

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError,savingError } = useContext(ItemContext);
  const {logout}=useContext(AuthContext);

  const [end, setEnd] = useState(MAX_PER_PAGE);
  const [start, setStart] = useState(0);

  async function searchNext($event: CustomEvent<void>) {
    setEnd(end+MAX_PER_PAGE);
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  const [searchText, setSearchText] = useState('');

  const [wasReceived, setWasReceived] = useState('all');

  useEffect(()=>{
    setEnd(MAX_PER_PAGE);
  },[searchText,wasReceived])

  useEffect(()=> {
    const el = document.querySelector('.square-a');
    if (el) {
      const animation = createAnimation()
          .addElement(el)
          .duration(5000)
          .direction('alternate')
          .iterations(Infinity)
          .keyframes([
            { offset: 0, transform: 'scale(3)', opacity: '1' },
            { offset: 0.5, transform: 'scale(1.5)', opacity: '1' },
            {
              offset: 1, transform: 'scale(0.5)', opacity: '0.2'
            }
          ]);
      animation.play();
    }
  }, []);



  log('render');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Item List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="square-a">
          <p>Your Item List</p>
        </div>
        <div><MyModal/></div>
        <IonItem>Filter by reception:</IonItem>
        <IonSelect value={wasReceived} placeholder="Select Reception" onIonChange={e => setWasReceived(e.detail.value)}>
          {['true','false','all'].map(option => <IonSelectOption key={option} value={option}>{option}</IonSelectOption>)}
        </IonSelect>
        <IonItem>Filter by text:</IonItem>
        <IonSearchbar
            value={searchText}
            debounce={1000}
            onIonChange={e => setSearchText(e.detail.value||'')}>
        </IonSearchbar>
        {savingError && (
            <div>{'Failed to save item to server - storing locally'}</div>
        )}
        {fetchingError && (
            <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonLoading isOpen={fetching} message="Fetching items"/>
        {items && (
          <IonList>
            {items.filter((item)=> item.text.startsWith(searchText))
                .filter((item)=> wasReceived==="all"? true : wasReceived === item.received.toString())
                .slice(start,end).map(({ _id,  celebrationDate, received, sentimentalValue,text,photo }) =>
              <Item key={_id} _id={_id} celebrationDate={celebrationDate} received={received} sentimentalValue={sentimentalValue} text={text} photo={photo} onEdit={id => history.push(`/item/${id}`)}/>)}
          </IonList>
        )}

        <IonInfiniteScroll threshold="100px" disabled={false}
                           onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent
              loadingText="Loading more good doggos...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={() => {
            logout?.();
            history.push('/login')
          }}>
            <IonIcon icon={logOut}/>
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
