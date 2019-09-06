import React from 'react';
import Msg from './InternalMessage';

const Comp = ({ msg }) => {
	return (
		<Msg msg={msg} alignment='center' background='#eee' margin={5} padding={5} width='40%' />
	);
};
export default Comp;
