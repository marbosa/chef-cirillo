import { Footer, Header, Main } from '../../components';
import styles from './Home.module.css';

function Home() {
    return (
        <div className={styles['home']}>
            <Header />
            <Main />
            <Footer /> 
        </div>
    );
};

export default Home;
