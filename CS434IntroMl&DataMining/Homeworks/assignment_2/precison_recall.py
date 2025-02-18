Py_x = [0.1,0.1,0.25,0.25,0.3,0.33,0.4,0.52,0.55,0.7,0.8,0.85,0.9,0.9,0.95,1.0]
y = [0,0,0,1,0,0,1,0,0,1,1,0,1,1,1,1]

for t in [0,0.2,0.4,0.6,0.8,1]:
  print("==============================================")
  print(f"When t is: {t}")
  
  numTruePositives = 0.000
  numFalsenegatives = 0.000
  numFlasePositives = 0.000
  for i in range(len(Py_x)):
    classifyPoint = 0
    if Py_x[i] <=  t:
      classifyPoint = 0
    else:
      classifyPoint = 1
    
    if y[i]==1 and classifyPoint==1:
      numTruePositives += 1
    elif y[i] == 1 and classifyPoint == 0:
      numFalsenegatives += 1
    elif y[i] == 0 and classifyPoint == 1:
      numFlasePositives += 1
  print(f"#TruePositives:{numTruePositives},#FalseNegative: {numFalsenegatives},#TruePositives:{numTruePositives}")
  if numTruePositives + numFalsenegatives == 0 or numTruePositives+numFlasePositives == 0:
    recall = precision = 0
    print(f" recall is: {recall:.2f}\n precision is: {precision:.2f}")
    break
  recall = numTruePositives/(numTruePositives+numFalsenegatives)
  precision =numTruePositives/(numTruePositives+numFlasePositives)
  # check for denominator equal to )
  
  print(f" recall is: {recall:.2f}\n precision is: {precision:.2f}")