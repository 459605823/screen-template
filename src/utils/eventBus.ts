import mitt from 'mitt';

type Events = {
  [key: string]: any;
};

export default mitt<Events>();
