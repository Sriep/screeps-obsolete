/**
 * @fileOverview Screeps module. Monitor cpu usage.
 * @author Piers Shepperson
 */
 
/**
 * Monitor cpu usage.
 * @module cpuUsage
 */
var cpuUsage = {
    CPU_MEMORY_LENGTH: 20,
    
    averageCpuLoad: function() {
        
        var AverageCPU = 0;
        if ("cpuUsage" in Memory)
        {
        	for (var i in Memory.cpuUsage)
        	{
        		AverageCPU = AverageCPU + Memory.cpuUsage[i];   
        	}
        	if (Memory.cpuUsage.length > 0)
        	{
        		AverageCPU = AverageCPU/Memory.cpuUsage.length
        	}
        } else {
        	Memory.cpuUsage = new Array(this.CPU_MEMORY_LENGTH).fill(0);
        }  
        return AverageCPU/Game.cpu.limit;  
    },
    
    updateCpuUsage: function() {
        if (undefined === Memory.cpuUsage)  {
            Memory.cpuUsage = [];
        }

        if (Memory.cpuUsage.length > 0) {
        	Memory.cpuUsage.shift();
        }
        Memory.cpuUsage.push(Game.cpu.getUsed());
    }   
}

module.exports = cpuUsage;    