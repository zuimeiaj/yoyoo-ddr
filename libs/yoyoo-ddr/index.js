import DDR from '../../src/components/ddr'

DDR.install = function(Vue){
    Vue.component(DDR.name, DDR)
}
export default DDR