import React, { useEffect, useState } from 'react';
import '../../styles/VerifyBox.css';
import { sleep } from '../utils/Other';
import { MdOutlinePersonSearch } from "react-icons/md";
import { Stack } from '@mui/material';

const SearchFilter = ({ pool, modifier, reset }) => {

    const [wordEntered, setWordEntered] = useState("");
    const [iconFocused, setIconFocused] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

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

    useEffect(async () => {
        if (inputFocused == false && window.location.pathname == "/verify") {
            await sleep(100);
            clearInput()
        }
    }, [inputFocused])

    return (
        <Stack className='search-wrapper'>
            <div className="search-container">
                <button
                    className="search-button"
                    onClick={() => { if (iconFocused) clearInput() }}
                    onBlur={() => setIconFocused(false)}
                    onFocus={() => setIconFocused(true)}
                >
                    {wordEntered ? (inputFocused || iconFocused ? "✖️" : <MdOutlinePersonSearch />) : <MdOutlinePersonSearch />}
                </button>
                <input
                    className="search-input"
                    onChange={(e) => { handleFilter(e.target.value) }}
                    onBlur={() => {
                        setInputFocused(false)
                    }}
                    onFocus={() => setInputFocused(true)}
                    type="text"
                    placeholder="Search for a Vehicle..."
                    value={wordEntered}
                >
                </input>
            </div>
        </Stack>
    );
}

export default SearchFilter;