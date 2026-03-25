import { useContext, useEffect, useState } from 'react';
import { PencilIcon, PlayIcon, PauseIcon, TrashIcon } from '../../assets/icons/jsx';
import { NumericInput } from '../index' ;
import styles from './Tasks.module.css';
import { PomodoroContext } from '../../contexts';
import { task } from '../../api/task';

const Tasks = () => {
    const [formData, setFormData] = useState({
        title: '',
        estimatedPomodoros: 4
    });

    const { activeTaskId, setActiveTaskId, setIsRunning } = useContext(PomodoroContext);

    const [taskList, setTaskList] = useState([]);

    const addItem = async () => {
        await task.create(formData);
        await getItems();
    };

    const deleteItem = async (id) => {
        await task.delete(id);
        await getItems();
    };
    
    const getItems = async () => {
        const result = await task.getAll();
        setTaskList(result.tasks.map(t => ({
            ...t,
            completedPomodoros: t.completed_pomodoros,
            estimatedPomodoros: t.estimated_pomodoros,
        })));
    };

    useEffect(() => {
        getItems();
    }, []);

    const [editItem, setEditItem] = useState(null);
    
    const saveEditItem = async (data, id) => {
        const estimated_pomodoros = data.estimatedPomodoros;
        await task.update({...data, estimated_pomodoros}, id);
        getItems(); 
    };

    const playTask = async (item) => {    
        if (activeTaskId !== item.id) {
            setActiveTaskId(item.id);
            await task.update({ status: 'in_progress' }, item.id);
            setTaskList(prev => [item, ...prev.filter(i => i.id !== item.id)]);
            setIsRunning(true);
        } else {
            await task.update({ status: 'pending' }, item.id);
            setIsRunning(false);
            setActiveTaskId(null);
        }
    };

    const completedItem = async (item) => {
        if (item.status !== 'completed') {
            await task.update({ status: 'completed', completed_at: new Date()}, item.id);
        } else {
            await task.update({ status: 'pending', completed_at: null}, item.id);
        }
        getItems();
    };

    return (
        <div className={styles['tasks__container']}>
            <ul className={styles['tasks__list']}>
                {
                    taskList.map(item => (
                        <li className={styles['tasks__list-item']} key={item.id}>
                            <input type="checkbox" onChange={() => completedItem(item)} checked={item.status === 'completed'}/>
                            
                            <div className={styles['tasks__list-item-info']}>
                                <span className={styles['tasks__list-item-title']} data-fulltext={item.title}>{item.title}</span>
                                <span className={styles['tasks__list-item-progress']}>{item.completedPomodoros}/{item.estimatedPomodoros}</span>
                            </div>

                            <div className={styles['tasks__list-item-actions']}>
                                <button
                                    onClick={() => playTask(item)}
                                >
                                    { activeTaskId === item.id ? <PauseIcon/> : <PlayIcon />}
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData(item);
                                        setEditItem(item);
                                    }}
                                >
                                    <PencilIcon />
                                </button>
                                <button
                                    onClick={() => deleteItem(item.id)}
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
                        value={formData.title}
                        placeholder='Name task'
                        className={styles['tasks__add-input']}  
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value}))}
                    />
                
                    <div className={styles['tasks__add-field']}>
                        <span>Estimated time</span>
                        <NumericInput 
                            name={'break'} 
                            value={formData.estimatedPomodoros}
                            minValue={0}
                            maxValue={30}
                            onChange={val => setFormData({ ...formData, estimatedPomodoros: val})}
                        />
                    </div>
                </div>

                <div className={styles['tasks__add-actions']}>
                    {editItem ? (
                        <>
                            <button onClick={() => {
                                setEditItem(null);
                                setFormData({ title: '', estimatedPomodoros: 4 });
                            }}>cancel</button>
                            <button onClick={() => {
                                saveEditItem(formData, editItem.id);
                                setEditItem(null);
                                setFormData({ title: '', estimatedPomodoros: 4 });
                            }}>save</button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                if (formData.title) {
                                    addItem();
                                    setFormData({ title: '', estimatedPomodoros: 4 });
                                }
                            }}
                        >add</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
