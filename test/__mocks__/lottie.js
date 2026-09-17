const createAnimation = () => ({
    addEventListener() {},
    destroy() {},
    goToAndPlay() {},
    goToAndStop() {},
    pause() {},
    play() {},
    removeEventListener() {},
    setDirection() {},
    setSpeed() {},
    stop() {},
});

const lottie = {
    loadAnimation: createAnimation,
};

export { createAnimation as loadAnimation };
export default lottie;
