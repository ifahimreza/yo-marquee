declare module 'yo-marquee' {
	interface YoMarqueeOptions {
		autoFill?: boolean;
		play?: boolean;
		pauseOnHover?: boolean;
		pauseOnClick?: boolean;
		direction?: 'left' | 'right';
		speed?: number;
		delay?: number;
		loop?: number;
		gradient?: boolean;
		gradientColor?: string;
		gradientWidth?: number | string;
	}

	export default class YoMarquee {
		constructor(
			container: HTMLElement | string,
			options?: YoMarqueeOptions
		);
		destroy(): void;
		init(): void;
		render(): void;
	}
}
