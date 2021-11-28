import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";

const SearchFilter = ({ in: data, out: callback, default: dflt }) => {

    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = data.filter((element) => {
            return element.name.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            callback(dflt);
        } else {
            callback(newFilter);
        }
    };

    const clearInput = () => {
        callback(dflt);
        setWordEntered("");
    };

    return (
        <div className="search">
            <div className="searchInputs">
                <input
                    type="text"
                    placeholder="search vehicles"
                    value={wordEntered}
                    onChange={handleFilter}
                />
                <button type="button" id="clearBtn" onClick={clearInput}>Reset</button>
            </div>
        </div>
    );
}

export default SearchFilter;