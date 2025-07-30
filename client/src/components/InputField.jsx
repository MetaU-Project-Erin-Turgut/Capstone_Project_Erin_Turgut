import "../styles/InputField.css"

const InputField = ({ placeholder, name, value, onChange}) => {
    return (
        <>
            <input className="input-field"
                placeholder={placeholder}
                type="text"
                name={name}
                value={value}
                onChange={(event) => {onChange(event)}}
            ></input>
            <br />
        </>
    )
}

export default InputField;