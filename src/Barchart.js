import React from "react";  
import { useState } from "react";
import { print } from "./print";  
import StackedBarChart from "./StackedBarChart"

export const Barchart = () => {
    const input = require("./data.json")
    
    let year = new Set()
    Object.values(input).forEach((v) => {year.add(v.year)})    
    year = Array.from(year)
    
    let allKeys = new Set()
    Object.values(input).forEach((v) => {allKeys.add(v.level_2)})      
    allKeys = Array.from(allKeys)

    let res = input.reduce((acc, {year, level_2, value}) =>
    {
        acc[year] = acc[year] || new Set();
        acc[year][level_2] = parseInt(value)
        acc[year]["year"] = parseInt(year)
        return acc;
    }, {})

    let data = []

    year.forEach(k => {
         data.push(res[k])
    });


    const getRandomColor = () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    let color = [
        "#656431",
        "#68A696",
        "#9F2964",
        "#C19131",
        "#A5235F",
        "#67ED30",
        "#14C069",
        "#109AE0",
        "#DCB545",
        "#BF354F"
    ]

    let colors = {}
    for (let v in allKeys) {
        colors[allKeys[v]] = color[v]
    }

    print(year)

    const [keys, setKeys] = useState(allKeys)

    
    return (
        <React.Fragment>
            <h2>Cases Recorded For Major Offences  </h2>
            <StackedBarChart data={data} keys={keys} colors={colors} />

            <div className="fields">
                {allKeys.map(key => (
                <div key={key} className="field">
                    <input
                    id={key}
                    type="checkbox"
                    checked={keys.includes(key)}
                    onChange={e => {
                        if (e.target.checked) {
                        setKeys(Array.from(new Set([...keys, key])));
                        } else {
                        setKeys(keys.filter(_key => _key !== key));
                        }
                    }}
                    />
                    <label htmlFor={key} style={{ color: colors[key] }}>
                    {key}
                    </label>
                </div>
                ))}
            </div>
        </React.Fragment>
    )
}




