import React, { useEffect, useState } from 'react';

const SearchFilter = ({ pool: pool, modifier: modifier, reset: reset }) => {

    const [wordEntered, setWordEntered] = useState("");
    const [localBackup, setLocalBackup] = useState([]);

    useEffect(() => {
        setLocalBackup(reset)
    }, [])

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
        const newFilter = localBackup.filter((element) => {
            return element.attributes.vhcid.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            modifier(reset);
        } else {
            modifier(newFilter);
        }
    };

    const clearInput = () => {
        modifier(reset);
        setWordEntered("");
    };

    console.log(wordEntered)

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