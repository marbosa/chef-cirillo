import { useContext, useState } from 'react';
import { PencilIcon, PlayIcon, PauseIcon, TrashIcon } from '../../assets/icons/jsx';
import { NumericInput } from '../index' ;
import styles from './Tasks.module.css';
import { PomodoroContext } from '../../contexts';

const Tasks = () => {
    const [formTask, setFormTask] = useState({
        name: '',
        estimatedSession: 4
    });

    const { activeTaskId, setActiveTaskId, setIsRunning } = useContext(PomodoroContext);

    const [taskList, setTaskList] = useState([
        { id: '1', name: 'Study JavaScript fundamentals', actualSession: 0, estimatedSession: 2 },
        { id: '2', name: 'Implement MongoDB connection', actualSession: 1, estimatedSession: 3 },
        { id: '3', name: 'Design Pomodoro timer UI', actualSession: 0, estimatedSession: 1 },
        { id: '4', name: 'Fix task completion bug', actualSession: 1, estimatedSession: 2 },
    ]);

    const addItem = () => {
        setTaskList(prev => [...prev, {
            id: Date.now().toString(),
            name: formTask.name,
            estimatedSession: formTask.estimatedSession,
            actualSession: 0
        }]);
    }; 

    const deleteItem = (item) => {
        setTaskList(prev => prev.filter(task => task.id !== item.id));
    };

    const [editItem, setEditItem] = useState(false);

    const playTask = (item) => {    
        if (activeTaskId !== item.id) {
            setActiveTaskId(item.id);
            setTaskList(prev => [item, ...prev.filter(i => i.id !== item.id)]);
            setIsRunning(true);
        } else {
            setIsRunning(false);
            setActiveTaskId(null);
        }
    };

    return (
        <div className={styles['tasks__container']}>
            <ul className={styles['tasks__list']}>
                {
                    taskList.map(item => (
                        <li className={styles['tasks__list-item']} key={item.id}>
                            <input type="checkbox" />
                            
                            <div className={styles['tasks__list-item-info']}>
                                <span className={styles['tasks__list-item-title']} data-fulltext={item.name}>{item.name}</span>
                                <span className={styles['tasks__list-item-progress']}>{item.actualSession}/{item.estimatedSession}</span>
                            </div>

                            <div className={styles['tasks__list-item-actions']}>
                                <button
                                    onClick={() => playTask(item)}
                                >
                                    { activeTaskId === item.id ? <PauseIcon/> : <PlayIcon />}
                                </button>
                                <button
                                    onClick={() => setEditItem(prev => !prev)}
                                >
                                    <PencilIcon />
                                </button>
                                <button
                                    onClick={() => deleteItem(item)}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </li> 
                    ))
                }
            </ul>

            <div className={styles['tasks__add']}>
                <div className={styles['tasks__add-container']}>
                    <input 
                        type='text' 
                        value={formTask.name}
                        placeholder='Name task'
                        className={styles['tasks__add-input']}  
                        onChange={(e) => setFormTask(prev => ({ ...prev, name: e.target.value}))}
                    />
                
                    <div className={styles['tasks__add-field']}>
                        <span>Estimated time</span>
                        <NumericInput 
                            name={'break'} 
                            value={formTask.estimatedSession}
                            minValue={0}
                            maxValue={30}
                            onChange={val => setFormTask({ ...formTask, estimatedSession: val})}
                        />
                    </div>
                </div>

                <div className={styles['tasks__add-actions']}>
                    { editItem ? (
                            <>
                                <button>cancel</button>
                                <button>save</button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    if (formTask.name) {
                                        addItem();
                                        setFormTask({ name: '', estimatedSession: 4 });
                                    }
                                }}
                            >add</button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Tasks;
