import { useEffect, useState, useRef } from 'react';
import { ArrowDownIcon, ArrowUpIcon, TickIcon } from './../../assets/icons/jsx';
import styles from './Select.module.css';


function Select({options, defaultValue, onChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleSelect(opt) {
        setSelected(opt);           
        onChange?.(opt);         
        setIsOpen(false);
    }

    return (
        <div className={styles['select']} ref={wrapperRef}>
            <button 
                className={styles['select__trigger']}
                onClick={() => setIsOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selected}</span>
                { isOpen ? <ArrowUpIcon/> : <ArrowDownIcon/> }
            </button>

            <ul 
                className={`${styles['select__menu']} ${isOpen ? styles['open'] : ''}`}
                role="listbox"
                aria-activedescendant={selected}
            >
                {options.map((opt, index) => (
                    <li
                        key={index}
                        role='option'
                        id={opt}
                        aria-selected={selected === opt}
                        onClick={() => handleSelect(opt)}                    
                    >
                        {opt}
                        {opt === selected && <TickIcon />}
                    </li>
                ))}  
            </ul> 
        </div>
    );
};

export default Select;
