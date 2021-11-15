import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

const Filter = ({ data: data, callback: callback, empty_state: empty }) => {

    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = data.filter((element) => {
            return element.name.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            callback(empty);
        } else {
            callback(newFilter);
        }
    };

    const clearInput = () => {
        callback(empty);
        setWordEntered("");
    };

    return (
        <div className="search">
            <div className="searchInputs">
                <input
                    type="text"
                    placeholder="search bruh"
                    value={wordEntered}
                    onChange={handleFilter}
                />
                <button type="button" id="clearBtn" onClick={clearInput}>Reset</button>
            </div>
        </div>
    );
}

export default Filter;