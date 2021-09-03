import React from 'react';
import { Link } from 'react-router-dom';
import prodStyle from './Product.module.css';

const Product = ({ id, image, name, price }) => {
	return (
		<Link to={`/detail/${id}`}>
			{/* 
			<div className={prodStyle.card}>
				<img src={image} alt="imagen" />
				<div className={prodStyle.cardData1}>
					<span className={prodStyle.cardPrice}>Price: ${price}</span>
					<span>💎💎</span>
				</div>
				<div className={prodStyle.cardData2}>
					<div className={prodStyle.cardText}>{name}</div>
				</div>
			</div>
			 */}

			<div className={prodStyle.card1}>
				<div className={prodStyle.cardheader}>
					<img src={image} alt={name} />
				</div>
				<div className={prodStyle.cardbody}>
					<div className={prodStyle.tag}>Technology</div>
					<div className={prodStyle.cardData1}>
					<span className={prodStyle.cardPrice}><b>Price:</b> ${price}</span>
					<span>💎💎</span>
				</div>
				<div className={prodStyle.cardText}>{name}</div>
				</div>
			</div>
		</Link>
	);
};

export default Product;
