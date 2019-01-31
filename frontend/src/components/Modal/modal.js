import React from 'react';
import * as classes from './modal.module.css';

const modal = (props) => (
    <div className={classes.modal}>
        <header className={classes.modalHeader}>
                <h1>{props.title}</h1>
        </header>
        <section className={classes.modalContent}>
            {props.children}
        </section>
        <div className={classes.modalAction}>
                <div className={classes.modalBtns}>
            {props.canCancel && <button className={classes.btnCancel} onClick={props.toggleModal}>Cancel</button>}
            {props.canConfirm && <button className={classes.btnConfirm} onClick={props.onConfirm}>Confirm</button>}
        </div>
        </div>
    </div>
);

export default modal;
