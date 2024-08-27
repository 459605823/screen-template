import mitt from 'mitt';

interface Events {
  [key: string]: any;
}

export default mitt<Events>();
