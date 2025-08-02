import { forwardRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { graphic as data } from '../data/graphic'; // твои данные
import './css/graphic.css';
export const Graphic = forwardRef((props, ref) => {
    const { t } = useTranslation();
    return (
        <div ref={ref} className="graphic-container">
            <img src="/vectors/5.png" alt="вектор3" className='vectors' style={{position: 'absolute', left: 100, top: 60}}/>
            <img src="/vectors/6.png" alt="вектор3" className='vectors' style={{position: 'absolute', right: 100, top: 40}}/>

            <h3 className="graphic-title">{t('graphic-title')}</h3>
            <div className="chart-card">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#333" strokeDasharray="5 5" />
                        <XAxis dataKey="month" stroke="#ccc" tickFormatter={(value) => t(`month.${value}`)}/>
                        <YAxis stroke="#ccc" />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: '#88ff00',
                                border: '2px solid #000',
                                borderRadius: '12px',
                                padding: '10px',
                                color: '#000',
                            }}
                            itemStyle={{
                                fontWeight: '500',
                                color: '#000',
                            }}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: 'none' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#d62eff" 
                            strokeWidth={2} 
                            dot={{ fill: '#88ff00', strokeWidth: 0, r: 6 }} 
                            activeDot={{ fill: '#88ff00', stroke: '#000', r: 10 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
});
