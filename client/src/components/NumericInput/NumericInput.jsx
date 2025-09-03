import { ArrowUpIcon, ArrowDownIcon } from '../../assets/icons/jsx';
import styles from './NumericInput.module.css';

function NumericInput({ name, value, minValue, maxValue, onChange }) {
    return (
        <div 
            className={styles['numeric-input']}
        >
            <input
                className={styles['numeric-input__field']}
                name={name}
                type="number"
                value={value}
                min={minValue}
                max={maxValue}
                aria-valuenow={value}
                aria-valuemin={minValue}
                aria-valuemax={maxValue}
                onChange={(e) => {
                    let val = Number(e.target.value); 
                    if (isNaN(val)) val = minValue;
                    if (val < minValue) val = minValue;
                    if (val > maxValue) val = maxValue;
                    onChange(val);                     
                }}            
            />

            <div className={styles['numeric-input__actions']}>
                <button
                    onClick={() => onChange(Math.min(value + 1, maxValue))}
                    aria-label='Increase value'              
                ><ArrowUpIcon/></button>
                <button
                    onClick={() => onChange(Math.max(value - 1, minValue))}
                    aria-label='Decrease value'        
                ><ArrowDownIcon/></button>
            </div>
        </div>
    );
};

export default NumericInput;
