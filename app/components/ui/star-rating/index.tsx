import { useState } from "react";
 import "./style.css";

export default function StarRating({count, value,inactiveColor='#ddd', size=24, activeColor='#f00', onChange}) {
  const stars = new Array(count).fill('🟊');

  // Internal handle change function
  const handleChange = (e, value) => {
    
    const area = e.target.getBoundingClientRect();
    console.log(area,e.clientX, e.clientY);
    
    
    // Check if half/star
    let isHalfStar = e.clientX > area.left && e.clientX < area.left + area.width/2;
    
    if (typeof onChange !== "function") return;
    
    if (!isHalfStar) return onChange(value + 1);
    
    if (isHalfStar) return onChange((value + 1) - 0.5);
  }

  //<i className="fas fa-star-half-alt"></i>

  return (
    <div className="flex">
      {stars.map((s, index) => {
        let style = inactiveColor;
        let className = "star fas fa-star";
        if (index < value) {
          style=activeColor;
        }
        
        // If the index matches the half rating
        // 3 == floor(3.5)
        if (index == Math.floor(value)) {
          if (!Number.isInteger(value)) {
            className = "fas fa-star-half-alt";
          }
        }
                
        return (
          <i className={className}  
            key={index}
            style={{color: style, width:size, height:size, fontSize: size}}
            onClick={(e)=>handleChange(e, index)}>
          </i>
        )
      })}
    </div>
  )
}