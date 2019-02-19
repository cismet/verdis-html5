import React from 'react';
import CismetFooterAcks from '../commons/CismetFooterAcknowledgements';

const Comp = ({ showModalMenu }) => {
	return (
		<div>
			<span style={{ fontSize: '11px' }}>
				<b>Hintergrundkarten</b>: True Orthophoto 2018, Amtliche Basiskarte (ABK) © Stadt Wuppertal |
				Stadtplanwerk 2.0 (Beta) © RVR | WebAtlasDE © BKG{' '}
				<a onClick={() => showModalMenu('datengrundlage')}>(Details und Nutzungsbedingungen)</a>
				<br />
				<CismetFooterAcks/>
				
			</span>
		</div>
	);
};

export default Comp;
Comp.defaultProps = {
	showModalMenu: () => {}
};