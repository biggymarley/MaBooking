import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export const LoadingContainer = () => {


    return (
        <div className='w-full h-full flex items-center justify-center flex-col'>
            <DotLottieReact
                src="/lottie/loading.lottie"
                loop
                autoplay
                height={100}
            />
            <p className='font text-2xl'>Loading...</p>
        </div>
    )
}