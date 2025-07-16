
import React, { useState, useEffect } from 'react';

const StatusDonutChart = ({ books })=>{
            // Calculate statistics
            const statusCounts = books.reduce((acc, { status }) => {
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});
    
            const totalBooks = books.length;
            const statusColors = {
                'Sold': 'text-indigo-600',
                'Available': 'text-emerald-500',
                'Reserved':'text-yellow-300'
            };
            const statusBgColors = {
                'Sold': 'bg-indigo-600',
                'Available': 'bg-emerald-500',
                'Reserved':'bg-yellow-300'
            };
    
            const segments = Object.entries(statusCounts)
                .map(([status, count]) => ({
                    status,
                    count,
                    percentage: Math.round((count / totalBooks) * 100),
                    color: statusColors[status],
                    bgColor: statusBgColors[status]
                }))
                .sort((a, b) => b.percentage - a.percentage);
    
            // Animation state
            const [animatedPercentages, setAnimatedPercentages] = useState(
                segments.reduce((acc, seg) => ({ ...acc, [seg.status]: 0 }), {})
            );
    
            useEffect(() => {
                // Animate the percentages on mount
                const animationDuration = 1500;
                const startTime = performance.now();
    
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / animationDuration, 1);
    
                    const newPercentages = {};
                    segments.forEach(seg => {
                        newPercentages[seg.status] = Math.floor(progress * seg.percentage);
                    });
    
                    setAnimatedPercentages(newPercentages);
    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
    
                requestAnimationFrame(animate);
            }, [books]);
    
            return (
                <div className="flex flex-col items-center space-y-8 p-6">
                    {/* Donut Chart with Animated Segments */}
                    <div className="relative w-64 h-64">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="10"
                            />
    
                            {/* Segments */}
                            {(() => {
                                let cumulativePercent = 0;
                                return segments.map((segment, i) => {
                                    const segmentPercent = animatedPercentages[segment.status] || 0;
                                    const dashArray = `${segmentPercent} ${100 - segmentPercent}`;
                                    const dashOffset = 100 - cumulativePercent;
                                    cumulativePercent += segmentPercent;
    
                                    return (
                                        <circle
                                            key={`${segment.status}-${i}`}
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="currentColor"
                                            className={segment.color}
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray={dashArray}
                                            strokeDashoffset={dashOffset}
                                            transform="rotate(-90 50 50)"
                                        />
                                    );
                                });
                            })()}
                        </svg>
    
                        {/* Center text with counter animation */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900">
                                {totalBooks}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">
                                Total Books
                            </span>
                        </div>
                    </div>
    
                    {/* Enhanced Legend */}
                    <div className="w-full space-y-4">
                        {segments.map((segment, i) => (
                            <div key={`legend-${segment.status}-${i}`} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${segment.bgColor}`} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {segment.status}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {segment.count}
                                    </span>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                        {animatedPercentages[segment.status] || 0}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
    
                </div>
            );
       
}

export default StatusDonutChart;
