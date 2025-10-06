import { useState } from 'react';
import { Select } from './../../components';
import styles from './Profile.module.css';


const Profile = () => {
    const sortOptions = {
        options: ['most recent', 'oldest', 'shortest duration', 'longest duration', 'A - Z', 'Z - A', 'group by task'],
        defaultValue: 'most recent'
    };

    const dateOptions = {
        options: ['day', 'week', 'month'],
        defaultValue: 'week'
    };

    const [selectedSort, setSelectedSort] = useState(sortOptions.defaultValue);
    const [selectedDate, setSelectedDate] = useState(dateOptions.defaultValue);

    return (
        <div className={styles['profile__container']}>
            <section className={styles['profile__section']}>
                <h2 className={styles['profile__section-title']}>Account Details</h2>
                
                <div className={styles['profile__section-item']}>
                    <span>Email</span>
                    <span>chefCirilo@gmail.com</span>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Account Created</span>
                    <span>25/10/25</span>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Last Login</span>
                    <span>25/10/25</span>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Log Out</span>
                    <button>Ok</button>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Log In</span>
                    <button>Ok</button>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Create Account</span>
                    <button>Ok</button>
                </div>
            </section>

            <section className={styles['profile__section']}>
                <h2 className={styles['profile__section-title']}>Summary</h2>
                <div className={styles['profile__section-item']}>
                    <span>Focused time</span>
                    <span>00</span>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Completed cycles</span>
                    <span>00</span>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Completed tasks</span>
                    <span>00</span>
                </div>
                <div className={styles['profile__section-item']}>
                    <span>Focused days record</span>
                    <span>00</span>
                </div>
            </section>
            <section className={styles['profile__section']}>
                <h2 className={styles['profile__section-title']}>History</h2>
                <div className={styles['profile__section-table-options']}>
                    <div className={styles['profile__section-table-option']}>
                        <span>Arrange by</span>
                        <Select 
                            options={sortOptions.options}
                            defaultValue={selectedSort}
                            onChange={(opt) => setSelectedSort(opt)}
                        />
                    </div>
                    <div className={styles['profile__section-table-option']}>
                        <span>View by</span>
                        <Select 
                            options={dateOptions.options}
                            defaultValue={selectedDate}
                            onChange={(opt) => setSelectedDate(opt)}
                        />
                    </div>
                </div>
                <table className={styles['profile__section-table']}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Project</th>
                            <th>Minutes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>24/10/2025</td>
                            <td>College</td>
                            <td>25</td>
                        </tr>
                        <tr>
                            <td>24/10/2025</td>
                            <td>work</td>
                            <td>30</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Profile;
