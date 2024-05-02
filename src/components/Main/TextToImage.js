import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './react-tabs.css';
import TextToImageEmbed from './TextToImageEmbed.js';


function TextToImage() {
    return (
      <div className="w-full h-full p-3">
        <Tabs>
          <TabList>
            <Tab>
              <div className='flex items-center'>
                <svg className="w-5 h-5 stroke-slate-800" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.192 12.25L14.1929 14.3232C14.1929 15.3293 14.1929 15.8324 13.9877 16.2171C13.807 16.5558 13.518 16.8314 13.1633 17.004C12.7606 17.2 12.2338 17.2 11.1803 17.2L4.01264 17.2C2.95915 17.2 2.43163 17.2 2.02886 17.004C1.67423 16.8314 1.38611 16.5558 1.20542 16.2171C1 15.8321 1 15.3283 1 14.3202V3.88018C1 2.87208 1 2.36766 1.20542 1.98262C1.38611 1.64393 1.67423 1.36876 2.02886 1.19619C2.43202 1 2.96018 1 4.01571 1H8.23229C8.34788 1 8.44915 1 8.53918 1.00078C8.80818 1.00313 8.9777 1.01266 9.14021 1.04992C9.33252 1.09402 9.51685 1.16674 9.68548 1.26543C9.87561 1.37671 10.0389 1.53263 10.3646 1.84375L13.3099 4.65668C13.6359 4.968 13.798 5.12322 13.9145 5.30487C14.0179 5.46592 14.0943 5.64153 14.1405 5.8252C14.1795 5.98041 14.1896 6.14309 14.192 6.4C14.1928 6.48598 14.1929 6.58272 14.1929 6.69312V6.85" stroke="current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.23529 9.5L9.37647 12.95M6.23529 9.5L9.37647 6.5M6.23529 9.5H17.7529" stroke="current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="pl-1 text-lg">Embed</h1>
              </div>
            </Tab>
            <Tab>
              <div className='flex items-center'>
                <svg className="w-5 h-5 stroke-slate-800" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.192 12.25L14.1929 14.3232C14.1929 15.3293 14.1929 15.8324 13.9877 16.2171C13.807 16.5558 13.518 16.8314 13.1633 17.004C12.7606 17.2 12.2338 17.2 11.1803 17.2L4.01264 17.2C2.95915 17.2 2.43163 17.2 2.02886 17.004C1.67423 16.8314 1.38611 16.5558 1.20542 16.2171C1 15.8321 1 15.3283 1 14.3202V3.88018C1 2.87208 1 2.36766 1.20542 1.98262C1.38611 1.64393 1.67423 1.36876 2.02886 1.19619C2.43202 1 2.96018 1 4.01571 1H8.23229C8.34788 1 8.44915 1 8.53918 1.00078C8.80818 1.00313 8.9777 1.01266 9.14021 1.04992C9.33252 1.09402 9.51685 1.16674 9.68548 1.26543C9.87561 1.37671 10.0389 1.53263 10.3646 1.84375L13.3099 4.65668C13.6359 4.968 13.798 5.12322 13.9145 5.30487C14.0179 5.46592 14.0943 5.64153 14.1405 5.8252C14.1795 5.98041 14.1896 6.14309 14.192 6.4C14.1928 6.48598 14.1929 6.58272 14.1929 6.69312V6.85" stroke="current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.7529 9.5L17.6118 12.95M20.7529 9.5L17.6118 6.5M20.7529 9.5H8" stroke="current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="pl-1 text-lg">Extract</h1>
              </div>
            </Tab>
          </TabList>

          <TabPanel>
            <div className='p-6 bg-white border border-t-0 border-black'>
              <TextToImageEmbed />
            </div>
            
          </TabPanel>
          <TabPanel>
            <div className='p-6 bg-white border border-t-0 border-black'>
              <h2>Any content 2</h2>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
  
export default TextToImage;
  