import css from './Loader.module.css';
import ClockLoader from 'react-spinners/ClockLoader';

function Loader() {
  return <div className={css.backdrop}>{<ClockLoader />}</div>;
}

export default Loader;
