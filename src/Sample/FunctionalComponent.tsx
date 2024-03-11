import { Props } from './Sample.types.ts';
import { useEffect } from 'react';

const FunctionalComponent = (props: Props) => {
  useEffect(() => {
    console.log('FC: Component mounted');

    return () => {
      console.log('FC: Component unmounted');
    };
  }, []);

  return <h1>Hello, {props.name}</h1>;
};

export default FunctionalComponent;
