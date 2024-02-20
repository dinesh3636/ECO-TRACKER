import { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon}) => {
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    return (
        <div style={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
            <input
                name={name}
                type={type === "password" ? (passwordVisibility ? "text" : "password") : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                style={{
                    borderRadius: "20px",
                    border: "2px solid lightgrey",
                    outline: "none",
                    color: "#1d2129",
                    margin: "2% 0",
                    width: "90%",
                    padding: "12px",
                    fontSize: "16px"
                }}
            />
            <i className={"fi "+ icon + " input-icon"}></i>
            {
                type === "password" &&
                <i
                    className={`fi fi-rr-eye${passwordVisibility ? "" : "-crossed"}`}
                    style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "4px", cursor: "pointer" }}
                    onClick={() => setPasswordVisibility(curVal => !curVal)}
                ></i>
            }
        </div>
    )
}

export default InputBox;