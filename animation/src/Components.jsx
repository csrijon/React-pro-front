import { useAnimate, useInView } from "framer-motion"
import { useEffect } from "react"

function Components() {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  
  useEffect(() => {
     if (isInView) {
       animate(scope.current, { opacity: 1 })
     }
  }, [isInView])
  
  return (
    <ul ref={scope}>
      <li />
      <li />
      <li />
    </ul>
  )
}
export default Components