golden.ratio = (sqrt(5) + 1)/2
fibonacci.angle=360/(golden.ratio^2)
#fibonacci.angle=137.5
#fibonacci.angle=30.045
#fibonacci.angle=14.9714
c=1
num_points=630
x=rep(0,num_points)
y=rep(0,num_points)

for (n in 1:num_points) {
    myn = n*1
    r=c*sqrt(myn)
    theta=fibonacci.angle*(myn)
    x[n]=r*cos(theta)
    y[n]=r*sin(theta)
}
plot(x,y,axes=FALSE,ann=FALSE,pch=19,cex=1,)
