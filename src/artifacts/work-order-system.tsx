import React, { useState } from 'react';
import { Save } from 'lucide-react';

const WorkOrderButtons = () => {
  const [plate, setPlate] = useState('');
  const [orderId, setOrderId] = useState('');
  const [activeStep, setActiveStep] = useState(null);
  
  const steps = [
    { id: 1, name: '環車檢查' },
    { id: 2, name: '車輛進廠資訊' },
    { id: 3, name: '問診' },
    { id: 4, name: '估時估價' },
    { id: 5, name: '交修確認' }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (plate) {
      setOrderId(`WO-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">車輛工單系統</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded border">
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1">車牌號碼</label>
            <input 
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="請輸入車牌號碼"
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            取得工單
          </button>
        </form>
        
        {orderId && (
          <div className="mt-4 text-sm">
            工單號碼: <span className="font-bold">{orderId}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 mb-6">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`flex-1 p-4 border rounded-lg ${
              activeStep === step.id 
                ? 'bg-sky-800 text-white' 
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="font-bold text-lg">{step.id}</div>
              <div>{step.name}</div>
            </div>
          </button>
        ))}
      </div>
      
      {activeStep && (
        <div className="p-4 border rounded bg-white">
          {activeStep === 4 ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-base mb-1">預交時間</label>
                  <input 
                    type="datetime-local"
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-base mb-1">指定技師</label>
                  <input 
                    type="text"
                    disabled
                    className="w-full border rounded p-2 bg-gray-100"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-base mb-1">預估工時</label>
                  <input 
                    type="text"
                    disabled
                    className="w-full border rounded p-2 bg-gray-100"
                  />
                </div>
              </div>

              <div className="rounded border">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1600px] border-collapse">
                    <thead>
                      <tr className="bg-sky-600 text-white">
                        <th className="border p-3 text-lg text-left" colSpan="9">委修項目</th>
                      </tr>
                      <tr className="bg-sky-600 text-white">
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">維修種類</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">工時代碼/零件件號</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">工時名稱/零件件名</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">申請數量</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">預計開工時間</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">預計完工時間</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">負責技師</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">收費別</th>
                        <th className="border p-3 text-lg w-28 whitespace-nowrap">收費對象</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 第一組委修項目 */}
                      <tr className="bg-gray-50">
                        <td colSpan="9" className="border p-2">
                          <input 
                            type="text" 
                            className="w-full border rounded p-1 bg-gray-100" 
                            placeholder="委修項目 1"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <select className="w-full border rounded p-1">
                            <option value="">請選擇</option>
                            <option value="自修">自修</option>
                            <option value="外修">外修</option>
                          </select>
                        </td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <select className="w-full border rounded p-1">
                            <option value="">請選擇</option>
                            <option value="自修">自修</option>
                            <option value="外修">外修</option>
                          </select>
                        </td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                      </tr>

                      {/* 第二組委修項目 */}
                      <tr className="bg-gray-50 border-t-4">
                        <td colSpan="9" className="border p-2">
                          <input 
                            type="text" 
                            className="w-full border rounded p-1 bg-gray-100" 
                            placeholder="委修項目 2"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <select className="w-full border rounded p-1">
                            <option value="">請選擇</option>
                            <option value="自修">自修</option>
                            <option value="外修">外修</option>
                          </select>
                        </td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <select className="w-full border rounded p-1">
                            <option value="">請選擇</option>
                            <option value="自修">自修</option>
                            <option value="外修">外修</option>
                          </select>
                        </td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"><input type="datetime-local" className="w-full border rounded p-1" /></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t">
                  <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded mb-6">
                    <Save size={18} />
                    儲存
                  </button>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* 追加金額行 */}
                    <div>
                      <label className="block text-base mb-1">追加工資金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">追加零件金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">追加合計金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>

                    {/* 原始金額行 */}
                    <div>
                      <label className="block text-base mb-1">原始工資金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">原始零件金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">原始合計金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>

                    {/* 最終金額行 */}
                    <div>
                      <label className="block text-base mb-1">最終工資金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">最終零件金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">最終合計金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>

                    {/* 自付金額行 */}
                    <div>
                      <label className="block text-base mb-1">自付工資金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">自付零件金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="block text-base mb-1">自付合計金額</label>
                      <input 
                        type="text" 
                        className="w-full border rounded p-2 bg-gray-100" 
                        disabled 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-bold mb-2">{steps.find(s => s.id === activeStep)?.name}</h2>
              <p className="text-gray-500">此區域將顯示 {steps.find(s => s.id === activeStep)?.name} 的內容</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkOrderButtons;