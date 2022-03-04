import React, { useState } from 'react';

const SearchFilter = ({ pool: pool, modifier: modifier, reset: reset }) => {

    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (word) => {

        setWordEntered(word);

        const newFilter = pool.filter((element) => {
            for (var value of Object.values(element.attributes)) {
                if (value.toLowerCase().includes(word.toLowerCase())) {
                    return 1
                }
            }
            return 0
        });

        console.log(newFilter)

        if (word === "") {
            modifier(reset);
        } else {
            modifier(newFilter);
        }
    };

    const clearInput = () => {
        modifier(reset);
        setWordEntered("");
    };

    return (
        <div className="search">
            <div className="searchInputs">
                <input
                    type="text"
                    placeholder="search vehicles"
                    value={wordEntered}
                    onChange={(e) => { handleFilter(e.target.value) }}
                />
                <button type="button" id="clearBtn" onClick={clearInput}>Reset</button>
            </div>
        </div>
    );
}

export default SearchFilter;