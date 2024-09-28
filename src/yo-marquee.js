import './yo-marquee.scss';

class YoMarquee {
	constructor(container, options = {}) {
		if (typeof container === 'string') {
			this.container = document.querySelector(container);
		} else {
			this.container = container;
		}

		if (!this.container) {
			throw new Error('Container element not found');
		}

		this.options = {
			autoFill: false,
			play: true,
			pauseOnHover: false,
			pauseOnClick: false,
			direction: 'left',
			speed: 50,
			delay: 0,
			loop: 1,
			gradient: false,
			gradientColor: 'white',
			gradientWidth: 200,
			destroy: false,
			...options,
		};

		this.childrenElements = Array.from(this.container.children);
		this.containerWidth = 0;
		this.marqueeWidth = 0;
		this.multiplier = 1;
		this.isMounted = false;

		this.resizeObserver = null;

		this.init();
	}

	/**
	 * Initializes the marquee by wrapping initial items, calculating dimensions,
	 * setting up resize observers, and applying styles.
	 */
	init() {
		this.container.classList.add('yo-marquee');
		this.wrapInitialItems();
		this.calculateWidth();
		this.setupResizeObserver();
		this.applyStyles();
		this.isMounted = true;
		this.render();
	}

	/**
	 * Destroys the marquee by disconnecting the resize observer, clearing the container,
	 * and restoring the original children.
	 */
	destroy() {
		if (!this.isMounted) return;

		this.isMounted = false;

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		// Remove all added classes and styles
		this.container.classList.remove('yo-marquee');
		this.container.removeAttribute('style');

		// Clear the container
		this.container.innerHTML = '';

		// Restore original children
		this.childrenElements.forEach((child) => {
			this.container.appendChild(child);
		});

		// Reset properties
		this.marquee = null;
		this.initialChildContainer = null;
		this.children = null;
		this.containerWidth = 0;
		this.marqueeWidth = 0;
		this.multiplier = 1;
	}

	/**
	 * Wraps the initial items with the necessary classes and creates the marquee structure.
	 */
	wrapInitialItems() {
		const initialChildContainer = document.createElement('ul');
		initialChildContainer.className = 'yom-list';
		initialChildContainer.setAttribute('role', 'list');

		this.childrenElements.forEach((childrenElement) => {
			const child = document.createElement('li');
			child.className = 'yom-item ' + childrenElement.className;
			child.setAttribute('role', 'listitem');

			child.innerHTML = childrenElement.innerHTML;
			initialChildContainer.appendChild(child);
		});

		const marquee = document.createElement('div');
		marquee.className = 'yom-track';
		marquee.setAttribute('aria-live', 'off');
		marquee.setAttribute('role', 'marquee');
		marquee.appendChild(initialChildContainer);

		this.container.innerHTML = ''; // Clear the original items
		this.container.appendChild(marquee);

		if (this.options.gradient) {
			const overlay = document.createElement('div');
			overlay.className = 'yom-overlay';
			this.container.insertBefore(overlay, marquee);
		}

		this.marquee = marquee;
		this.initialChildContainer = initialChildContainer;
		this.children = Array.from(this.initialChildContainer.children);
	}

	/**
	 * Calculates the width of the container and marquee to determine how many times
	 * the items need to be duplicated.
	 */
	calculateWidth() {
		if (this.marquee && this.container) {
			const containerRect = this.container.getBoundingClientRect();
			const marqueeRect = this.marquee.getBoundingClientRect();
			let containerWidth = containerRect.width;
			let marqueeWidth = marqueeRect.width;

			if (
				this.options.direction === 'up' ||
				this.options.direction === 'down'
			) {
				containerWidth = containerRect.height;
				marqueeWidth = marqueeRect.height;
			}

			if (this.options.autoFill && containerWidth && marqueeWidth) {
				this.multiplier =
					marqueeWidth < containerWidth
						? Math.ceil(containerWidth / marqueeWidth)
						: 1;
			} else {
				this.multiplier = 1;
			}

			this.containerWidth = containerWidth;
			this.marqueeWidth = marqueeWidth;
		}
	}

	/**
	 * Sets up a resize observer to recalculate widths on container resize.
	 */
	setupResizeObserver() {
		if (this.marquee && this.container) {
			const resizeObserver = new ResizeObserver(() =>
				this.calculateWidth()
			);
			resizeObserver.observe(this.container);
			resizeObserver.observe(this.marquee);
		}
	}

	/**
	 * Applies necessary styles to the container, marquee, and children.
	 */
	applyStyles() {
		this.container.style.setProperty(
			'--pause-on-hover',
			!this.options.play || this.options.pauseOnHover
				? 'paused'
				: 'running'
		);
		this.container.style.setProperty(
			'--pause-on-click',
			!this.options.play ||
				(this.options.pauseOnHover && !this.options.pauseOnClick) ||
				this.options.pauseOnClick
				? 'paused'
				: 'running'
		);
		this.container.style.setProperty(
			'--width',
			this.options.direction === 'up' || this.options.direction === 'down'
				? '100vh'
				: '100%'
		);
		this.container.style.setProperty(
			'--transform',
			this.options.direction === 'up'
				? 'rotate(-90deg)'
				: this.options.direction === 'down'
				? 'rotate(90deg)'
				: 'none'
		);

		if (this.options.gradient) {
			const overlay = this.container.querySelector('.yom-overlay');
			if (overlay) {
				overlay.style.setProperty(
					'--gradient-color',
					this.options.gradientColor
				);
				overlay.style.setProperty(
					'--gradient-width',
					typeof this.options.gradientWidth === 'number'
						? `${this.options.gradientWidth}px`
						: this.options.gradientWidth
				);
			}
		}

		this.marquee.style.setProperty(
			'--play',
			this.options.play ? 'running' : 'paused'
		);
		this.marquee.style.setProperty(
			'--direction',
			this.options.direction === 'left' ? 'normal' : 'reverse'
		);
		this.marquee.style.setProperty('--duration', `${this.getDuration()}s`);
		this.marquee.style.setProperty('--delay', `${this.options.delay}s`);
		this.marquee.style.setProperty(
			'--iteration-count',
			this.options.loop ? `${this.options.loop}` : 'infinite'
		);

		this.marquee.style.setProperty(
			'--min-width',
			this.options.autoFill ? 'auto' : '100%'
		);

		this.children.forEach((child) => {
			child.style.setProperty(
				'--transform',
				this.options.direction === 'up'
					? 'rotate(90deg)'
					: this.options.direction === 'down'
					? 'rotate(-90deg)'
					: 'none'
			);
		});
	}

	/**
	 * Calculates the duration of the marquee animation.
	 */
	getDuration() {
		if (this.options.autoFill) {
			return (this.marqueeWidth * this.multiplier) / this.options.speed;
		} else {
			return this.marqueeWidth < this.containerWidth
				? this.containerWidth / this.options.speed
				: this.marqueeWidth / this.options.speed;
		}
	}

	/**
	 * Clones the children multiple times to fill the container.
	 */
	multiplyChildren(multiplier) {
		const fragment = document.createDocumentFragment();
		for (let i = 0; i < multiplier; i++) {
			this.children.forEach((child) => {
				const clonedChild = child.cloneNode(true);
				fragment.appendChild(clonedChild);
			});
		}
		return fragment;
	}

	/**
	 * Renders the cloned children into the marquee.
	 */
	render() {
		if (!this.isMounted) return;
		this.marquee.innerHTML = '';
		this.marquee.appendChild(this.initialChildContainer);

		this.initialChildContainer.appendChild(
			this.multiplyChildren(this.multiplier - 1)
		);

		this.initialChildContainer.appendChild(
			this.multiplyChildren(this.multiplier)
		);
	}
}

export default YoMarquee;

if (typeof window !== 'undefined') {
	window.YoMarquee = YoMarquee;
}
