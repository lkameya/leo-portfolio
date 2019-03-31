jQuery(document).ready(function($) {
    
	const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
	const cos = document.querySelector('.cos');
	if (cos) {
		const cosNmb = getRandomInt(1,4);
		const cosClass = `cos--${cosNmb}`;
		cos.classList.add(cosClass);
		/*cos.addEventListener('click', () => {
			recordOutboundLink(this, 'Outbound Links', `COS_Monday_15March_c${cosNmb}`);
			return false;
		});*/
	}


});