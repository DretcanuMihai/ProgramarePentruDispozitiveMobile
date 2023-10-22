export interface ItemProps {
  _id?: string;
  _failed?: boolean;
  celebrationDate: Date;
  received: boolean;
  sentimentalValue: number;
  text: string;
  photo?: string;
  latitude?: number|undefined
  longitude?: number|undefined
}
