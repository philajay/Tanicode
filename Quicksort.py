def part(a, left, right): #left and right are the start and end indixes of the subarray
    i = left
    pivot = a[right]# choose last element in subarray as pivot
     
    for j in range(left , right):
        if a[j] < pivot:
            a[j], a[i] = a[i], a[j]
            i += 1
             
    pos = i 
    a[pos], a[right] = a[right], a[pos]
     
    return pos #new pivot position. Used to determine the next left and right side of the
 
 
def quick_sort(a, left, right):
 
    if left < right: 
        pivot_pos = part(a, left, right )
        #recursively call quick_sort on left and right
        quick_sort(a, left, pivot_pos - 1)
        quick_sort(a, pivot_pos + 1, right)


        
a = [7,2,1,6,8,5,3,4]
print 'a before sorting: \n %s' % str(a)
quick_sort(a, 0, len(a) - 1)
print 'a after sorting: \n %s' % str(a) 
 
